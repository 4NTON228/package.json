import { supabase } from '../lib/supabase'

const handleSignUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password
    })
    if (error) throw error
  } catch (error) {
    console.error(error)
  }
}