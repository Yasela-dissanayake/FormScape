import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import React, { useState } from "react";
import { useOutletContext } from "react-router";
import {
  PROGRESS_INTERVAL_MS,
  PROGRESS_STEP,
  REDIRECT_DELAY_MS,
} from "../../lib/constants";

interface UploadProps {
  onComplete?: (data: string) => void;
}

const Upload = ({ onComplete }: UploadProps = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { isSignedIn } = useOutletContext<AuthContext>();

  const processFile = (fileToProcess: File) => {
    if (!isSignedIn) return;
    setFile(fileToProcess);
    setProgress(0);

    const reader = new FileReader();

    reader.onerror = () => {
      setFile(null);
      setProgress(0);
    };

    reader.onload = () => {
      const base64Data = reader.result as string;
      const interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + PROGRESS_STEP;
          if (next >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              if (onComplete) {
                onComplete(base64Data);
              }
            }, REDIRECT_DELAY_MS);
            return 100;
          }
          return next;
        });
      }, PROGRESS_INTERVAL_MS);
    };
    reader.readAsDataURL(fileToProcess);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isSignedIn) return;
    setIsDragging(false);

    if (!isSignedIn) return;

    const droppedFile = e.dataTransfer.files[0];
    const allowedTypes = ["image/jpeg", "image/png"];

    if (droppedFile && allowedTypes.includes(droppedFile.type)) {
      processFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div>
      <div className="upload">
        {!file ? (
          <div
            className={`dropzone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="drop-input"
              accept=".jpg, .jpeg, .png"
              disabled={!isSignedIn}
              onChange={handleFileChange}
            />

            <div className="drop-content">
              <div className="drop-icon">
                <UploadIcon size={20} />
              </div>

              <p>
                {isSignedIn
                  ? "Click or drag file here"
                  : "Sign in or sign up with Puter to upload"}
              </p>
              <p className="help">Maximum file size 50MB.</p>
            </div>
          </div>
        ) : (
          <div className="upload-status">
            <div className="status-content">
              <div className="status-icon">
                {progress === 100 ? (
                  <CheckCircle2 className="check" />
                ) : (
                  <ImageIcon className="image" />
                )}
              </div>

              <h3>{file.name}</h3>

              <div className="progress">
                <div className="bar" style={{ width: `${progress}%` }} />

                <p className="status-text">
                  {progress < 100
                    ? "Analyzing Floor Plan..."
                    : "Redirecting..."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Upload;
