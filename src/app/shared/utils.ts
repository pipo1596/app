
export function showWait(message?:string): void {
  if(!message)message = 'Loading...';
    document.getElementById("loader")?.classList.remove("d-none");    
    let mesghtml = document.getElementById("loaderMessage"); 
      if(mesghtml)  mesghtml.innerHTML = message;
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
export function formatDateUS(date:Date) {
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}
export function baseliveurl(){
 let url = window.location.href;
 if(getSite()=='K'){

      if(url.indexOf('localhost')>=0)return "https://stage.uspatriottactical.com/";
      if(url.indexOf('.54')>=0)return "https://stage.uspatriottactical.com/";
      if(url.indexOf('.56')>=0)return "https://stage.uspatriottactical.com/";
      if(url.indexOf('stage')>=0)return "https://stage.uspatriottactical.com/";
      if(url.indexOf('.52')>=0)return "https://www.uspatriottactical.com";
      return "https://www.uspatriottactical.com" 

 }else{

      if(url.indexOf('localhost')>=0)return "https://itestv2.galls.com";
      if(url.indexOf('.54')>=0)return "https://itestv2.galls.com";
      if(url.indexOf('.56')>=0)return "https://istage.galls.com";
      if(url.indexOf('stage')>=0)return "https://istage.galls.com";
      if(url.indexOf('.52')>=0)return "https://www.galls.com";
      return "https://www.galls.com/"

 }
}
export function escapeHtml(input: string): string {
  return input
        .replace(/'/g, "&apos;")
        .replace(/’/g, "&rsquo;")
        .replace(/‘/g, "&lsquo;")
        .replace(/°/g, "&deg;")
        .replace(/”/g, "&ldquo;");
}
export function transformToSeoUrl(text: string): string {
  return text
    .trim()
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // Remove any non-alphanumeric characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .trim(); // Remove leading and trailing spaces
}
export function transformToTags(text: string): string {
  return text
    .trim()
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s-]/g, '') // Remove any non-alphanumeric characters except spaces and hyphens
    .replace(/ +/g, ' ') // Replace multiple spaces with a single space
    .trim(); // Remove leading and trailing spaces
}
export function sortByKey(array:any, key:string,dir:string) {
  return array.sort(function(a:any, b:any) {
      var x = a[key]; var y = b[key];
     if (dir=="D")
      return ((x > y) ? -1 : ((x < y) ? 1 : 0));  
     else
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
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
export function convertToDate(dateStr: string): Date {
  // Ensure the date and time are padded to the correct length if needed
  const year = dateStr.substring(0, 4);
  const month = dateStr.substring(4, 6);  // MM
  const day = dateStr.substring(6, 8);    // DD
  
  
  
  // Format into an ISO 8601 string
  let isoDateStr = `${year}-${month}-${day}T00:00:00Z`;
  isoDateStr = adjustTimeFormat(isoDateStr)
  // Convert to a Date object and get the timestamp
  const date = new Date(isoDateStr);
  date.setHours(date.getHours() + 5);//This is the server time 
  return date;
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
  let isoDateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}Z`;
  isoDateStr = adjustTimeFormat(isoDateStr)
  // Convert to a Date object and get the timestamp
  const date = new Date(isoDateStr);
  date.setHours(date.getHours() + 5);//This is the server time 
  return date;
}
function adjustTimeFormat(timeStr:string) {
  return timeStr.replace(/:(\d)(Z|$)/, ':0$1$2');  // Adds a leading zero to single digit seconds
}
export function timeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const years = Math.floor(seconds / (365.25 * 24 * 60 * 60));
  const months = Math.floor(seconds / (30.44 * 24 * 60 * 60));
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);

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