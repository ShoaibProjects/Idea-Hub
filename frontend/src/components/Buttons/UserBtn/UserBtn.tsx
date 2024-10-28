import React from 'react'
import { User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useSelector} from 'react-redux';
import { selectUser } from '../../Auth/userSlice';

function UserBtn() {
  const user = useSelector(selectUser);
  return (
    <Link to="/user" style={{width: '100%', padding: '0rem 3rem'}}><button className='user-btn'><User/>
      {user.username ? (user.username
      ) : (
        "user"
      )}
    </button></Link>
  )
}

export default UserBtn




