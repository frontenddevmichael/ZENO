import { supabase } from "../supabase";




export  async function getFeaturedProducts() {
    const { data, error } = await supabase.from("products").select("*").eq("is_featured", true).gt("stock", 1).order("created_at", {ascending :false}) /* get featured prodcuts to render in the home page  from featured boolean and stock */
    if (error) {
        throw  error
    }else{
        return data
    }  /* eror control  */
}
export async function getProducts({ category, min, max, sort }) {
    // 1. Start with a basic "Select All"
    let query = supabase
        .from("products")
        .select("*")
        .gt("stock" ,1)

    // 2. Add Category filter (if it's not 'all' or null)
    if (category && category !== 'all') {
        query = query.eq("category", category);
    }

    // 3. Add Price filters
    if (min) query = query.gte("price", min); // Greater than or equal
    if (max) query = query.lte("price", max); // Less than or equal

    // 4. Handle Sorting
    if (sort === 'price-low') {
        query = query.order("price", { ascending: true });
    } else if (sort === 'price-high') {
        query = query.order("price", { ascending: false });
    } else {
        // Default: Newest first
        query = query.order("created_at", { ascending: false });
    }

    // 5. Execute the query
    const { data, error } = await query;

    if (error) throw error;
    return data;
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