import cv2
import numpy as np
cap = cv2.VideoCapture(0)
list_of_images=[]
list_of_ingredients=[]
if not cap.isOpened():
    print("Failed to open camera")
    exit()
count=0
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()
    cv2.waitKey(1)
    # Display the resulting frame
    cv2.imshow('Frame', frame)

    # Check if the user pressed the 's' key to capture the image
    if cv2.waitKey(1) == ord('s'):
        filename='captured_image'+str(count)+'.jpg'
        cv2.imwrite(filename, frame)
        list_of_images.append(filename)
        count=count+1
        continue
    elif cv2.waitKey(1) == ord('q'):
        break

# Release the video capture object and close the windowq
cap.release()


net = cv2.dnn.readNetFromDarknet('yolov3.cfg', 'yolov3.weights')
for element in list_of_images:
    image = cv2.imread(element)
    height, width, _ = image.shape

    blob = cv2.dnn.blobFromImage(image, 1/255, (416, 416), swapRB=True, crop=False)
    net.setInput(blob)
    layer_names = net.getLayerNames()
    output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
    outs = net.forward(output_layers)
    class_ids = []
    confidences = []
    boxes = []
    with open('coco.names', 'r') as f:
        classes = f.read().splitlines()
    for out in outs:
        for detection in out:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if confidence > 0.5:
                center_x = int(detection[0] * width)
                center_y = int(detection[1] * height)
                w = int(detection[2] * width)
                h = int(detection[3] * height)

                x = int(center_x - w / 2)
                y = int(center_y - h / 2)

                class_ids.append(class_id)
                confidences.append(float(confidence))
                boxes.append([x, y, w, h])

    indices = cv2.dnn.NMSBoxes(boxes, confidences, 0.5, 0.4)
    for i in indices:
        i = i.item()  # Convert numpy.int32 to Python int
        x, y, w, h = boxes[i]
        class_id = class_ids[i]
        confidence = confidences[i]

        label = classes[class_id]
        list_of_ingredients.append(label)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 255, 0), 2)
        cv2.putText(image, label, (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)
        # cv2.imshow('Object Detection', image)
    #cv2.waitKey(0)
    #cv2.destroyAllWindows()
for ingredients in list_of_ingredients:
    print(ingredients)

