
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
export function scrollToTop(){
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
export function focusField(id:string){  
  
  if(id=="")return;

  setTimeout(() => {
    let field =document.getElementById(id);
    field?.focus();
    field?.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"}); 
  }, 100);
  
}
export function showToast(): void {
    showWait();
         setTimeout(() => {
          document.getElementById("toastNote")?.classList.remove("d-none");
          document.getElementById("toastMain")?.classList.add("show");
         
         }, 300);
        setTimeout(() => {
            document.getElementById("toastNote")?.classList.add("d-none");
            document.getElementById("toastMain")?.classList.remove("show");
           
        }, 2500);
        
     
}

export function openModal(id:string) {
    var modal = document.getElementById(id);
    if(modal){
    const backdrop = document.createElement('div');
    // Remove the show from the initial classList, we will add it in the timeout
    //
    // backdrop.classList.add('modal-backdrop', 'fade', 'show');
    backdrop.classList.add('modal-backdrop', 'fade');
    document.body.classList.add('modal-open');
    document.body.appendChild(backdrop);
   
    modal.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    
    // We don't need to specify the milliseconds in this timeout, since we don't want a delay,
    // we just want the changes to be done outside of the normal DOM thread.
    setTimeout(() => {
      // Move adding the show class to inside this setTimeout
      modal?.classList.add('show');
      // Add the show class to the backdrop in this setTimeout
      backdrop.classList.add('show');
    });
  }
  }

  export function closeModal(id:string) {
    const backdrop = document.querySelector('.modal-backdrop.fade.show');
    var modal: any | null;
    if(id == "")  modal = document.querySelector('.modal');
    else  modal = document.getElementById(id);
    modal?.setAttribute('aria-hidden', 'true');
    backdrop?.classList.remove('show');
    // We want to remove the show class from the modal outside of the regular DOM thread so that
    // transitions can take effect
    setTimeout(() => {
      modal?.classList.remove('show');
    });
    
    // We want to set the display style back to none and remove the backdrop div from the body
    // with a delay of 500ms in order to give their transition/animations time to complete
    // before totally hiding and removing them.
    setTimeout(() => {
      if(modal)
      modal.style.display = 'none';
      if(backdrop)
      backdrop.remove();
    }, 500); // this time we specified a delay
  }