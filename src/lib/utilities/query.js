import { supabase } from "../supabase";




export  async function getFeaturedProducts() {
    const { data, error } = await supabase.from("products").select("*").eq("is_featured", true).gt("stock", 0).order("created_at", {ascending :false}) /* get featured prodcuts to render in the home page  from featured boolean and stock */
    if (error) {
        throw  error
    }else{
        return data
    }  /* eror control  */
}

export  async function  getProductBySlug (slug) {
    const {data , error} = await supabase.from("products").select("*").eq("slug" , slug).single();
    if (error) {
        throw error
    } else {
        return data
} /* same logic but for single slug condtional rendering */
}






export async  function createOrder(orderData){
    const {data , error} = await supabase.from('order').insert([orderData]).select().single();

    if (error) {
        console.error("Error creating order:", error.message);
        throw error;
    }else{
    return data;
}
}