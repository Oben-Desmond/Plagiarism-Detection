
function numConverter(num){
    let numstr=num+``
    num=parseInt(numstr)
    if(num){
        if(numstr.length<=3){
          return numstr
        }
         else if(numstr.length<=6){
             return `${numstr.substring(0,numstr.length-3)}K`
         }
         else if(numstr.length<=9){
            return `${numstr.substring(0,numstr.length-6)}M`
        }
        else if(numstr.length<=12){
            return `${numstr.substring(0,numstr.length-9)}B`
        }else{
            return `${numstr.substring(0,numstr.length-9)}B`
          }
    }
    return `0`
}

export default numConverter