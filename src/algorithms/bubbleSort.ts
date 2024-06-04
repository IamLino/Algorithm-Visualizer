import { AnimationArrayType } from "@/lib/types";

function runBubbleSort(array: number[], animations: AnimationArrayType) {
    for(let i = 0; i < array.length - 1; i++){
        for(let j = 0; j < array.length - 1 - i; j++){
            animations.push([[j, j+1], false]); // Say we are comparing j & j+1 but we are not swapping them
            if(array[j] > array[j + 1]){
                animations.push([[j, array[j+1]], true]); // Stores the j index and its new value (j+1)
                animations.push([[j+1, array[j]], true]); // Stores the j + 1 index and its new value (j)
                [array[j], array[j + 1]] = [array[j + 1], array[j]]; // Swap the number in the array
            }
        }
    }
}

export function generateBubbleSortAnimationArray(
    isAnimationRunning: boolean,
    array: number[],
    runAnimation: (animations: AnimationArrayType) => void,
){
    // Guards
    if (isAnimationRunning) return;
    if (array.length <= 1) return [];

    const animations: AnimationArrayType = [];
    const tempArray = array.slice();

    runBubbleSort(tempArray, animations);
    runAnimation(animations);
}