import { createClient } from "../supabase/server"

export default async function getUserInServer(){

    try {
        const supabase = await createClient()
        const {data, error} = await supabase.auth.getClaims()
        if (error) throw new Error(error.message)
        else if (!data) throw new Error('Unable to retrieve the user id in getUserInServer()')

        return {userId: data.claims.sub, error: null}
    }
    catch(error){
        if (error instanceof Error) return {userId: 'placeholder', error: error.message}
        else return {userId: 'placeholder', error: 'An unknown error occured in executing getUserInServer()'}
    }
}