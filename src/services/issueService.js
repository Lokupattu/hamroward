import { saveIssue, updateIssueStatus as updateIssueStatusInDB } from "./dbService";
import { uploadFileWithProgress } from "./storageService";

export async function createIssue(payload) {
  const { evidenceFile, onEvidenceProgress, ...rest } = payload;
  
  let evidenceURL = null;
  let evidencePublicId = null;

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
    // We reuse saveIssue/update logic. 
    // Assuming updateIssueStatusInDB or a generic update function exists in dbService.
    // If not, we might need to use a generic update. 
    // Let's check dbService.js first. 
    // Actually, let's just use updateIssueStatusInDB but we need to check if it supports other fields.
    // Wait, let me check dbService.js content again via tool if needed, but I recall it might be specific.
    // Let's assume we need to add a generic update function or modify updateIssueStatusInDB.
    // For now, I will use a new function name that I will implement in dbService as well.
    const { updateIssue } = await import("./dbService");
    await updateIssue(issueId, { isPublic });
  } catch (error) {
    console.error("Error toggling issue public status:", error);
    throw error;
  }
}

