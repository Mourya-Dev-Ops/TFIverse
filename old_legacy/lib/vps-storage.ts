import { writeFile, unlink, mkdir } from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { existsSync } from 'fs';

// Upload to VPS public folder
export async function uploadToVPS(
  file: File,
  folder: 'avatars' | 'banners',
  options?: { preserveAnimation?: boolean }
) {
  try {
    console.log('📤 Upload started:', { folder, type: file.type, size: file.size });
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes);

    // Get extension - FORCE STRING
    const fileName = String(file.name || 'upload.jpg');
    const parts = fileName.split('.');
    const ext = parts.length > 1 ? parts[parts.length - 1].toLowerCase() : 'jpg';
    const originalExtension = String(ext);
    
    console.log('📁 File extension:', originalExtension);
    
    // Check if GIF
    const isGif = file.type === 'image/gif' || originalExtension === 'gif';
    
    // Generate filename - ALL STRINGS
    const timestamp = String(Date.now());
    const randomStr = String(Math.random().toString(36).substring(2, 9));
    const fileExtension = isGif ? 'gif' : originalExtension;
    const filename = `${timestamp}-${randomStr}.${fileExtension}`;
    
    console.log('📝 Generated filename:', filename, typeof filename);
    
    // Build upload directory path - ALL STRINGS
    const cwd = String(process.cwd());
    const folderStr = String(folder);
    const uploadsDir = path.join(cwd, 'public', 'uploads', folderStr);
    
    // Create directory if it doesn't exist
    if (!existsSync(uploadsDir)) {
      console.log('📁 Creating directory:', uploadsDir);
      await mkdir(uploadsDir, { recursive: true });
    }
    
    // Build final file path - ALL STRINGS
    const filePath = path.join(uploadsDir, String(filename));
    
    console.log('📍 Upload path:', filePath);
    
    // If GIF - save directly
    if (isGif && options?.preserveAnimation) {
      console.log('🎬 GIF detected - preserving animation');
      await writeFile(filePath, buffer);
      
      const url = `/uploads/${folderStr}/${filename}`;
      console.log('✅ GIF uploaded:', url);
      
      return {
        url: url,
        filename: filename,
        size: buffer.length,
      };
    }

    // Process non-GIF with Sharp
    console.log('🖼️ Processing with Sharp...');
    
    const config = folderStr === 'avatars'
      ? { width: 500, height: 500, fit: 'cover' as const }
      : { width: 1200, height: 400, fit: 'cover' as const };

    let sharpInstance = sharp(buffer).resize(config.width, config.height, {
      fit: config.fit,
      position: 'center',
    });

    // Output format
    if (originalExtension === 'png') {
      buffer = await sharpInstance.png({ quality: 90 }).toBuffer();
    } else if (originalExtension === 'webp') {
      buffer = await sharpInstance.webp({ quality: 85 }).toBuffer();
    } else {
      buffer = await sharpInstance.jpeg({ quality: 85 }).toBuffer();
    }

    // Save processed image
    await writeFile(filePath, buffer);

    const url = `/uploads/${folderStr}/${filename}`;
    console.log('✅ Image uploaded:', url);

    return {
      url: url,
      filename: filename,
      size: buffer.length,
    };

  } catch (error) {
    console.error('❌ Upload error:', error);
    throw new Error('Failed to upload file');
  }
}

// Delete from VPS
export async function deleteFromVPS(
  folder: 'avatars' | 'banners',
  filename: string
) {
  try {
    const cwd = String(process.cwd());
    const folderStr = String(folder);
    const filenameStr = String(filename);
    
    const filePath = path.join(cwd, 'public', 'uploads', folderStr, filenameStr);
    
    await unlink(filePath);
    console.log('🗑️ File deleted:', filenameStr);
    return true;
  } catch (error) {
    console.error('❌ Delete error:', error);
    return false;
  }
}
