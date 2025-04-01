---
title: YOLOv8 数据集构建
date: 2025-03-31 16:02:54
tags:
---


1. 准备数据集
2. labelimg 标注
3. make sence 数据集标注
4. roboflow 公开数据集



数据准备：

图片类型数据： 直接标注
视频类型数据： 抽帧处理，导出为图片，再进行标注





extract.py 文件 提取视频帧
```

import cv2
import os

def extract_frames(video_path, output_folder, frame_interval=1):
    # Print the video path for verification
    print(f"Attempting to open video file: {video_path}")

    # Check if the video file exists
    if not os.path.exists(video_path):
        print(f"Error: Video file does not exist at {video_path}")
        return

    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Open the video file
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Error: Could not open video.")
        return

    frame_count = 0
    saved_frame_count = 0

    while True:
        # Read a frame from the video
        ret, frame = cap.read()
        if not ret:
            break

        # Save the frame every 'frame_interval' frames
        if frame_count % frame_interval == 0:
            frame_filename = os.path.join(output_folder, f"frame_{saved_frame_count:04d}.jpg")
            cv2.imwrite(frame_filename, frame)
            saved_frame_count += 1

        frame_count += 1

    # Release the video capture object
    cap.release()
    print(f"Extracted {saved_frame_count} frames.")

# Example usage
video_path = './video.mp4'
output_folder = './output_frames'
extract_frames(video_path, output_folder, frame_interval=30)

```

labelimg 标注：

pip install labelimg

labelimg --version

命令行执行 labelimg 命令打开 labelimg mac 环境操作发生闪退。



make sense 数据集标注：
https://www.makesense.ai/

公开数据集
https://public.roboflow.com/object-detection

https://universe.roboflow.com/


参考：
https://www.bilibili.com/video/BV1CfQqYUEL5?spm_id_from=333.788.videopod.episodes&vd_source=ffda878df0ed45bee1ade91d8f451048&p=4