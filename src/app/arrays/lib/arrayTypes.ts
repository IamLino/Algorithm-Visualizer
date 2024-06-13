// String union of all the sorting algorithm's
export type SortingAlgorithmType = 
    | "bubble"
    | "insertion"
    | "selection"
    | "merge"
    | "quick";

/*
 * Boolean: Determines whether we swapping the line items
 * Number[]: If we not are swapping it will be a list of lines indexes (which we will update the color of)
 * if we are swapping it will be an index as well as it's new height (which we will update the height of)
 * 
*/
export type AnimationArrayType = [number[], boolean, ][];