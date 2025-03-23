
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ohndxlrpdglmduzlsinu.supabase.co';
// Using the public API key which is safe to include in client-side code
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obmR4bHJwZGdsbWR1emxzaW51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3Njk5MzEsImV4cCI6MjA1ODM0NTkzMX0.s3YSGdn5WwR9CQs9o2qHz_B7b9dCIr_pv7hroU-cT20';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Function to save registration data
export const saveRegistration = async (formData: {
  name: string;
  phone: string;
  email: string;
  classType: 'individual' | 'group';
  selectedDate: Date | null;
  selectedTime: string | null;
}) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .insert([
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          class_type: formData.classType,
          class_date: formData.selectedDate ? formData.selectedDate.toISOString() : null,
          class_time: formData.selectedTime,
          payment_status: 'pending',
          created_at: new Date().toISOString()
        }
      ])
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error saving registration:', error);
    return { success: false, error };
  }
};

// Function to validate registration by ID
export const validateRegistration = async (registrationId: string) => {
  try {
    const { data, error } = await supabase
      .from('registrations')
      .update({ payment_status: 'confirmed' })
      .eq('id', registrationId)
      .select();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error validating registration:', error);
    return { success: false, error };
  }
};
