import {
  saveIssue,
  updateIssueStatus as updateIssueStatusInDB,
} from "./dbService";
import { uploadFileWithProgress } from "./storageService";

export async function createIssue(payload) {
  const { evidenceFile, onEvidenceProgress, ...rest } = payload;

  let evidenceURL = null;
  let evidencePublicId = null;
  let evidenceType = null;

  if (evidenceFile) {
    try {
      const uploadResult = await uploadFileWithProgress({
        file: evidenceFile,
        onProgress: onEvidenceProgress,
      });
      // Ensure we get the URL correctly
      if (uploadResult && uploadResult.downloadURL) {
        evidenceURL = uploadResult.downloadURL;
        evidencePublicId = uploadResult.publicId;
        evidenceType = uploadResult.resourceType;
      }
    } catch (error) {
      console.error("Error uploading evidence:", error);
      // If upload fails, we should probably alert the user or fail the whole process
      // For now, let's throw so the UI shows an error
      throw new Error("Failed to upload evidence file. Please try again.");
    }
  }

  const issueData = {
    ...rest,
    evidenceUrl: evidenceURL,
    evidencePublicId,
    evidenceType,
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const savedIssue = await saveIssue(issueData);
    return savedIssue;
  } catch (error) {
    console.error("Error creating issue:", error);
    throw error;
  }
}

export async function updateIssueStatus(issueId, status) {
  try {
    await updateIssueStatusInDB(issueId, status);
  } catch (error) {
    console.error("Error updating issue status:", error);
    throw error;
  }
}

export async function toggleIssuePublicStatus(issueId, isPublic) {
  try {
    const { updateIssue } = await import("./dbService");
    await updateIssue(issueId, { isPublic });
  } catch (error) {
    console.error("Error toggling issue public status:", error);
    throw error;
  }
}

export async function deleteIssue(issueId) {
  try {
    const { deleteIssue } = await import("./dbService");
    await deleteIssue(issueId);
  } catch (error) {
    console.error("Error deleting issue:", error);
    throw error;
  }
}
