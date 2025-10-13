function groupEachArrayByProperty(matrix: any[], property: string) {
    return matrix.map(subArray => {
        const grouped = subArray.records.reduce((acc: any, obj: any) => {
            const key = `${subArray.id}.${obj[property]}`;
            if (!acc[key]) {
                acc[key] = {
                    id: key,
                    records: []
                };
            }
            acc[key].records.push(obj);
            return acc;
        }, {});

        return Object.values(grouped); // Return grouped objects as separate arrays
    }).flat(); // Flatten one level to maintain sibling group structure
}

function aggregateNumbers(numbers: number[], method: string) {
    if (!Array.isArray(numbers) || numbers.length === 0) {
        console.log("Invalid input: numbers must be a non-empty array.");
        return 0;
    }

    switch (method.toLowerCase()) {
        case 'sum':
            return numbers.reduce((acc, num) => acc + num, 0);

        case 'average':
            return numbers.reduce((acc, num) => acc + num, 0) / numbers.length;

        case 'min':
            return Math.min(...numbers);

        case 'max':
            return Math.max(...numbers);

        case 'count':
            return numbers.length;

        default:
            console.log("Invalid method: Supported methods are 'sum', 'average', 'min', 'max', and 'count'.");
            return 0;
    }
}

function calculate(matrixData: any[], calcMethods: {field: string, agg: string}[]) {
    return calcMethods.reduce((mxData, calcMethod) => {
        return mxData.map(md => {
            return {
                ...md,
                [`${calcMethod.field}.${calcMethod.agg}`]: (calcMethod.agg != "count") ? (aggregateNumbers(
                        md.records.map((rcd: any) => (rcd[calcMethod.field])),
                        calcMethod.agg
                    )) : (md.records.length)
            };
        });
    }, matrixData);
}

function multiGrouping(matrix: any, properties: any) {
    return properties.reduce((acc: any[], prop: string) => {
        return groupEachArrayByProperty(acc, prop);
    }, [{id: "main", records: matrix}]);
}


// const matrixData = [
//     { id: 1, user: "ab", category: 'fruit', name: 'Apple', quantity: 2 },
//     { id: 1, user: "ab", category: 'fruit', name: 'Avocado', quantity: 2 },
//     { id: 3, user: "gg", category: 'fruit', name: 'Banana', quantity: 2 },
//     { id: 5, user: "bb", category: 'fruit', name: 'Orange', quantity: 2 },
//     { id: 6, user: "ab", category: 'diry', name: 'Milk', quantity: 2 },
//     { id: 2, user: "ab", category: 'vegetable', name: 'Carrot', quantity: 2 },
//     { id: 7, user: "gg", category: 'diry', name: 'Butter', quantity: 2 },
//     { id: 4, user: "bb", category: 'vegetable', name: 'Broccoli', quantity: 2 }
// ];
// let groupped_data = multiGrouping(matrixData, ['user', 'category']);
// console.log(JSON.stringify(calculateSingle(groupped_data, [
//     {
//         agg: "sum",
//         field: "quantity"
//     },
//     {
//         agg: "count",
//         field: "quantity"
//     }
// ])));