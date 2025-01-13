
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
export function dbtodsptime(timeString:string){

// Extract the hour and minute

const hours = timeString.length === 4 ? timeString.substring(0, 2) : timeString.substring(0, 1); // Handling for 3-digit times (e.g. 610)
const minutes = timeString.length === 4 ? timeString.substring(2, 4) : timeString.substring(1, 3); // Handling for 3-digit times

// Pad the hour and minute with leading zeros if necessary
return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;

}
export function dbtodspdate(dateString:string){

// Extract parts of the date
const year = dateString.substring(0, 4);
const month = dateString.substring(4, 6);
const day = dateString.substring(6, 8);

// Create a formatted date in YYYY-MM-DD format
return `${year}-${month}-${day}`;
}

export function getSite():string{
  let site = localStorage.getItem('site');
  if(site) 
    return site;
  else
    return "";
}
export function scrollToTop(){
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  })
}
export function scrollToTopInstant(){
  window.scrollTo({
    top: 0,
    behavior: 'instant',
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
export function convertToTimestamp(dateStr: string, timeStr: string): Date {
  // Ensure the date and time are padded to the correct length if needed
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);  // MM
  const day = dateStr.substring(6, 8);    // DD
  
  const hour = timeStr.substring(0, 2);   // HH
  const minute = timeStr.substring(2, 4); // MM
  const second = timeStr.substring(4, 6); // SS
  
  // Format into an ISO 8601 string
  const isoDateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  
  // Convert to a Date object and get the timestamp
  const date = new Date(isoDateStr);
  date.setHours(date.getHours() + 5);//This is the server time 
  return date;
}
export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const years = Math.floor(seconds / (365.25 * 24 * 60 * 60));
  const months = Math.floor(seconds / (30.44 * 24 * 60 * 60));
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  const remainingSeconds = seconds % 60;

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else {
    return `few seconds ago`;
  }
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