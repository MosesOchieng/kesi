import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getSheriaHubCases = async () => {
  try {
    const filePath = path.join(process.cwd(), 'sheriahub_cases.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading SheriaHub cases:', error);
    return [];
  }
};

export const updateSheriaHubCases = async (cases) => {
  try {
    const filePath = path.join(process.cwd(), 'sheriahub_cases.json');
    fs.writeFileSync(filePath, JSON.stringify(cases, null, 2));
    return true;
  } catch (error) {
    console.error('Error updating SheriaHub cases:', error);
    return false;
  }
}; 