
import {NextResponse} from 'next/server';
import path from 'path';
import fs from 'fs/promises';

// Helper function to get the path to data.json
function getDataPath() {
  // The path needs to be resolved differently for production builds vs. dev server
  // In dev, CWD is the project root. In prod, it's inside .next/server/app
  const jsonDirectory = path.join(process.cwd(), 'src', 'lib');
  return path.join(jsonDirectory, 'data.json');
}

export async function GET() {
  try {
    const filePath = getDataPath();
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading data.json:', error);
    return NextResponse.json({ message: 'Error reading data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newData = await request.json();
    const filePath = getDataPath();

    // Read existing data
    const fileContents = await fs.readFile(filePath, 'utf8');
    const existingData = JSON.parse(fileContents);

    // Merge new data with existing data
    const updatedData = { ...existingData, ...newData };

    await fs.writeFile(filePath, JSON.stringify(updatedData, null, 2));
    
    return NextResponse.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error writing to data.json:', error);
    return NextResponse.json({ message: 'Error writing data' }, { status: 500 });
  }
}
