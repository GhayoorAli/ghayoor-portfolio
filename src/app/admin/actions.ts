'use server'

import { revalidatePath } from 'next/cache'

export async function revalidatePortfolio() {
  revalidatePath('/')
  revalidatePath('/work', 'layout')
  revalidatePath('/admin', 'layout')
}
