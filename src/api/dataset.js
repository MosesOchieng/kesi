import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATASET_FILE = path.join(__dirname, '../../data/dataset.json');

// Function to load the dataset from the local cache
export const getDataset = async () => {
  try {
    const data = await fs.promises.readFile(DATASET_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading dataset:', error);
    return [];
  }
};

// Function to update the dataset cache
export const updateDataset = async (data) => {
  try {
    await fs.promises.writeFile(DATASET_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating dataset:', error);
    return false;
  }
};

// Function to initialize the dataset (to be called during server startup)
export const initializeDataset = async () => {
  try {
    // Check if dataset file exists
    await fs.promises.access(DATASET_FILE);
    console.log('Dataset already cached');
  } catch {
    // If file doesn't exist, create it with empty array
    await fs.promises.writeFile(DATASET_FILE, JSON.stringify([], null, 2));
    console.log('Dataset initialized');
  }
}; 