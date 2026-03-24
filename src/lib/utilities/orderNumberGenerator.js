

export default function getOrderNumber (){
    const orderNum = Math.floor(Math.random() * 9000) + 1000;
    return `ZN-${orderNum}`
}


