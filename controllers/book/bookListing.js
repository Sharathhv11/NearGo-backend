import handelAsyncFunction from "../../utils/asyncFunctionHandler.js";
import bookModel from "../../models/bookModel.js";

//~ function for creating the query for the grater than for lesser then query
function formatQuery(query){

    const copyQuery = {...query};

    if(copyQuery.publishedYearGT && copyQuery.publishedYearLT ){

        copyQuery.publishedYear = {
            $gte :  Number(copyQuery.publishedYearGT),
            $lte :  Number(copyQuery.publishedYearLT)
        }
        delete copyQuery.publishedYearGT;
        delete copyQuery.publishedYearLT;

    }else{

        if( copyQuery.publishedYearGT ){
            copyQuery.publishedYear = {
                $gte :  Number(copyQuery.publishedYearGT)
            }
            delete copyQuery.publishedYearGT;
        }
    
        if( copyQuery.publishedYearLT ){
            copyQuery.publishedYear = {
                $lte :  Number(copyQuery.publishedYearLT)
            }
            delete copyQuery.publishedYearLT;
        }

    }

    return copyQuery;
}


//~function to filter based on the priceRange
function formatRange(query){
    const copyQuery = {...query};

    
    const rangeString = copyQuery.range.split(" ");

    copyQuery.sellingPrice = {
        $gte : Number(rangeString[0]),
        $lte : Number(rangeString[1])
    }
    delete copyQuery.range;

    return copyQuery;
    
}

//~ function that manages the list of the books and more
const bookListing = handelAsyncFunction(async(req,res,next) => {
    
    //^ extract the query to list the books for the user
    let { query } = req;

    //^ if user query the year range format the query 
    if( query?.publishedYearGT || query?.publishedYearLT )
           query = formatQuery(query);

    //^ if user query the price range format the query
    if( query?.range ) query = formatRange(query);

    //^ regular expression to match the string 
    if (query?.title) {
        query.title = { $regex: query.title, $options: "i" };
    }
    if (query?.author) {
        query.author = { $regex: query.author, $options: "i" };
    }

    //^ sorting 
    const sortBy = query?.sortBy || "createdAt";
    const sortOrder = query?.sortOrder === "asc" ? 1 : -1;
    delete query.sortBy;
    delete query.sortOrder;

    //^ pagination
    const page = Number(query?.page) || 1;
    const limit = Number(query?.limit) || 10;
    const skip = (page - 1) * limit;
    delete query.page;
    delete query.limit;

    //^ fetching details of the books 
    const books = await bookModel.find({
        ...query
    })
    .sort({ [sortBy]: sortOrder })  
    .skip(skip)                     
    .limit(limit)
    .populate("postedBy","username profile");


    res.status(200).send({
        status:"success",
        message:"Books fetched successfully.",
        page,
        limit,
        total:books.length,
        data : books
    })
})


export default bookListing;