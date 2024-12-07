
export function showWait(): void {
    document.getElementById("loader")?.classList.remove("d-none");    
}
export function hideWait(timeout?:number): void {
    if(timeout){
        setTimeout(() => {
            document.getElementById("loader")?.classList.add("d-none");
        }, timeout);
    }else{
            document.getElementById("loader")?.classList.add("d-none");
    }
        
}
  