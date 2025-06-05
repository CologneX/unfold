"use client";

import { useState } from "react";
import {
  Stack,
  TextInput,
  Radio,
  Group,
  Text,
  Button,
  Alert,
  Image,
  Box,
} from "@mantine/core";
import { isValidImageUrl } from "@/lib/imageUtils";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { CloseOutlined, PictureOutlined, UploadOutlined } from "@ant-design/icons";

interface ImageInputProps {
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ImageInput({
  label,
  placeholder,
  description,
  required = false,
  value,
  onChange,
  error,
}: ImageInputProps) {
  const [inputType, setInputType] = useState<"url" | "file">("url");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    try {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file");
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size must be less than 5MB");
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append("image", file);

      // Upload file to our API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      // Set the uploaded file path
      onChange(result.path);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    onChange(newUrl);
  };

  const clearInput = () => {
    onChange("");
    // FileInput doesn't expose a direct way to clear its value via ref
    // We'll rely on the onChange prop to clear the state
  };

  return (
    <Stack gap="xs">
      <Text size="sm" fw={500}>
        {label} {required && <span style={{ color: "red" }}>*</span>}
      </Text>

      {description && (
        <Text size="xs" c="dimmed">
          {description}
        </Text>
      )}

      <Radio.Group
        value={inputType}
        onChange={(value) => setInputType(value as "url" | "file")}
      >
        <Group gap="md">
          <Radio
            value="url"
            label="Enter URL"
            // icon={LinkOutlined}
          />
          <Radio
            value="file"
            label="Upload File"
            // icon={IconUpload}
          />
        </Group>
      </Radio.Group>

      {inputType === "url" ? (
        <TextInput
          placeholder={
            placeholder ||
            "https://example.com/image.jpg or /images/project/image.jpg"
          }
          value={value}
          onChange={(e) => handleUrlChange(e.currentTarget.value)}
          error={error}
          //   leftSection={<IconLink size={16} />}
        />
      ) : (
        <Stack gap="xs">
          {value && (
            <Group justify="space-between" align="center" mb="xs">
              <Text size="sm" fw={500}>
                Preview:
              </Text>
              <Button
                size="xs"
                variant="outline"
                color="red"
                onClick={clearInput}
              >
                Clear
              </Button>
            </Group>
          )}
          <Dropzone
            onDrop={(files) => {
              const file = files[0];
              if (file) {
                handleFileUpload(file);
              }
            }}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            multiple={false}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <UploadOutlined style={{ fontSize: 52 }} color="var(--mantine-color-blue-6)" />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <CloseOutlined style={{ fontSize: 52 }} color="var(--mantine-color-red-6)" />
              </Dropzone.Reject>

              {/* Preview */}
              {value && (
                <Box>
                  {isValidImageUrl(value) ? (
                    <Image
                      src={value}
                      alt="Preview"
                      h={100}
                      w="auto"
                      fit="contain"
                      radius="sm"
                      fallbackSrc="/images/placeholder.svg"
                    />
                  ) : (
                    <Alert color="yellow" variant="light">
                      <Group>
                        {/* <IconPhoto size={16} /> */}
                        <Text size="sm">Image path: {value}</Text>
                      </Group>
                    </Alert>
                  )}
                </Box>
              )}
              {!value && (
                <>
                  <Dropzone.Idle>
                    <PictureOutlined
                      style={{ fontSize: 52 }}
                      color="var(--mantine-color-dimmed)"
                    />
                  </Dropzone.Idle>
                  <div>
                    <Text size="xl" inline>
                      Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                      Attach as many files as you like, each file should not
                      exceed 5mb
                    </Text>
                  </div>
                </>
              )}
            </Group>
          </Dropzone>
          {/* <FileInput
            ref={fileInputRef}
            placeholder="Choose image file..."
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            // leftSection={<IconUpload size={16} />}
            error={uploadError || error}
          /> */}

          {uploading && (
            <Alert color="blue" variant="light">
              <Text size="sm">Uploading image...</Text>
            </Alert>
          )}

          {uploadError && (
            <Alert color="red" variant="light">
              <Text size="sm">{uploadError}</Text>
            </Alert>
          )}
        </Stack>
      )}
    </Stack>
  );
}
