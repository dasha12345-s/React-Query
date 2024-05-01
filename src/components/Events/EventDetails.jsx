import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import{ fetchEvent, deleteEvent, queryClient } from '../../util/http'

import Header from '../Header.jsx';
import ErrorBlock from '../UI/ErrorBlock';
import { useState } from 'react';
import Modal from '../UI/Modal';

export default function EventDetails() {

  const [isDeliting, setIsDeliting] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({signal}) => fetchEvent({
      signal, id: params.id
    }),
  }) 

  const { 
      mutate, 
      isPending: isPendingDelition, 
      isError: isErrorDeleting,
      error: deleteError,
    } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['events'],
        refetchType: 'none'
      });
      navigate('/events')
    }
  })

  function handleStartDelete(){
    setIsDeliting(true);
  }

  function handleStopDelete(){
    setIsDeliting(false);
  }


  function handleDelete(){
    mutate({ id: params.id });
  }

  let content;

  if (isPending){
    content = (
      <div id='event-details-content' className='center'>
      <p>Fetching data...</p>
    </div>
    )
  }

  if (isError){
    content = (
      <div id='event-details-content' className='center'>
    <ErrorBlock title='faild to load event' message={error.info?.message || 'Error occured!!!'}/>
    </div>
    )
  }

  if (data){
    const formattedDate = new Date(data.date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: '2-digit'
    })

    content = (
      <>
      <header>
      <h1>{data.title}</h1>
      <nav>
        <button onClick={handleStartDelete}>Delete</button>
        <Link to="edit">Edit</Link>
      </nav>
    </header>
      <div id="event-details-content">
      <img src={`http://localhost:3000/${data.image}`} alt={data.title} />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data.location}</p>
          <time dateTime={`Todo-DateT$Todo-Time`}>{formattedDate} @ {data.time}</time>
        </div>
        <p id="event-details-description">{data.description}</p>
      </div>
    </div>
    </>
    )
  }
  
  return (
    <>
    {isDeliting && (
      <Modal onClose={handleStopDelete}>
      <h2>Are you sure?</h2>
      <p>Do you really want to delete this event?</p>
      <div className='form-actions'>
        {isPendingDelition && <p> DELETING, please wait</p>}
        {!isPendingDelition && (
          <>
          <button onClick={handleStopDelete} className='button-text'> Cancel </button>
        <button onClick={handleDelete} className='button'> Delete </button>
          </>
        )}
      </div>
      {isErrorDeleting && <ErrorBlock title='Failed to delete event' message={deleteError.info?.message || 'ERRORR!!'}/>}
    </Modal>
    )}
      <Outlet />
      <Header>
        <Link to="/events" className="nav-item">
          View all Events
        </Link>
      </Header>
      <article id="event-details">
      {content}
      </article>
    </>
  );
}
