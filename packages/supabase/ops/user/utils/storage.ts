import { Logger } from 'next-axiom';
import { SupabaseClient } from '../../../types';

/**
 * Process userData from a FormData with an updated
 * FormData with public image_url of uploaded file.
 */
export const processUserData = async (
  userData: FormData,
  { supabase }: { supabase: SupabaseClient },
) => {
  const image = userData.get('image') as File;
  const email = userData.get('email') as string;

  if (image.size > 0) {
    const url = await uploadAndGetAvatarImageUrl(email, image, {
      supabase: supabase,
    });

    // return FormData with updated image_url
    return {
      avatar_url: url as string,
      first_name: userData.get('first_name') as string,
      last_name: userData.get('last_name') as string,
      middle_name: userData.get('middle_name') as string,
      email: userData.get('email') as string,
      phone: userData.get('phone') as string,
      role: userData.get('role') as string,
      active: (userData.get('active') as unknown as boolean) ?? true,
    };
  } else {
    // return FormData without the avatar url
    return {
      first_name: userData.get('first_name') as string,
      last_name: userData.get('last_name') as string,
      middle_name: userData.get('middle_name') as string,
      email: userData.get('email') as string,
      phone: userData.get('phone') as string,
      role: userData.get('role') as string,
      active: (userData.get('active') as unknown as boolean) ?? true,
    };
  }
};

/**
 * Upload userData image to userDatas bucket.
 *
 * By default, we use SKUs as filenames
 */
export const uploadAvatarImage = async (
  filename: string,
  avatarImage: File,
  { supabase }: { supabase: SupabaseClient },
) => {
  const log = new Logger();

  // get the file ext. of the image
  const ext = avatarImage.name.split('.').pop();

  // upload image to supabase buckets using userData id as filename
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(`${filename}.${ext}`, avatarImage, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error)
    log.error(`Error uploading avatar image to buckets: ${filename}`, {
      error,
    });

  return { data };
};

/**
 * Get public url of an image in userDatas bucket
 * */
export const getAvatarImageUrl = async (
  filepath: string,
  { supabase }: { supabase: SupabaseClient },
) => {
  // get the public url of the uploaded image
  const { data } = supabase.storage.from('avatars').getPublicUrl(filepath);

  return data.publicUrl;
};

/**
 * Upload the provided image file to userDatas buckets
 * and return the public url.
 * */
export const uploadAndGetAvatarImageUrl = async (
  filename: string,
  image: File,
  { supabase }: { supabase: SupabaseClient },
) => {
  try {
    // upload the userData image to supabase buckets `userDatas`
    const { data } = await uploadAvatarImage(filename, image, {
      supabase: supabase,
    });

    // get the public url of the image uploaded
    if (data) {
      return await getAvatarImageUrl(data.path, { supabase: supabase });
    }
  } catch (e: unknown) {
    throw new Error('Error uploading avatar image');
  }
};
