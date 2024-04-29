export async function fetchEvents(serchTerm) {
  let url =  'http://localhost:3000/events';

  if (serchTerm){
    url += '?search=' + serchTerm
  }

  const response = await fetch('http://localhost:3000/events');

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}