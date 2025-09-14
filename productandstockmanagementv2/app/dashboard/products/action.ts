'use server'

import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers"
import { v4 as uuidv4 } from 'uuid';
export async function uploadImages(formData: FormData)
{
const cookieStore = await cookies();
const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    {cookies: {get:(name)=>cookieStore.get(name)?.value}}
);

const images = formData.getAll("images") as File[];
const uploadResults = []
for (const image of images)
{
    const filename = `${uuidv4()}-${image.name}`;
    console.log('Generating URL from bucket:', 'uploads'); 
    const{data, error} = await supabase.storage.from('uploads').upload(filename, image);

    if(error)
    {
        console.log('Error to image upload', error);
        return { error: `Failed to upload ${image.name}. Reason: ${error.message}` };
        
    }
    console.log('Generating URL from bucket:', 'uploads'); 
const { data: urlData } = supabase.storage
      .from('uploads')
      .getPublicUrl(data.path);
      
    if (!urlData.publicUrl) {
        return { error: `Could not get public URL for ${image.name}.` };
    }

    uploadResults.push(urlData.publicUrl);
  }

  return { urls: uploadResults };
}