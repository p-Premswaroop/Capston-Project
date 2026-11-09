 export const STATUS = {
    1: "NEW",
    2: "CLOSED",
    3: "REOPEN"
}

export const dateFormatter = (dateString) => {
      
    const date = new Date(dateString);

    const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${date.toLocaleString('en-US', {
      month: 'short'
    })}-${date.getFullYear()}`;

    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${formattedDate} Time: ${formattedTime}`;
  
}