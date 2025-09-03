import './index.css'
import './App.scss'
import type { IUser } from './interface/user.interface'
import { useEffect, useState } from 'react'
import { APIService } from './service/API.service'
import User from './components/User/User'
import Form from './components/Form/Form'

function App() {
    const [users, setUsers] = useState<IUser[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)
    const [isShowMore, setIsShowMore] = useState<boolean>(true)

    const GetUsers = async () => {
        setLoading(true)
        const data = await APIService.GetUsers()
        const sortedUsers = APIService.SortUsers(data.users)
        setUsers(sortedUsers)

        if (data.total_pages > 1) {
            setIsShowMore(true)
        } else {
            setIsShowMore(false)
        }

        setLoading(false)
    }

    const ShowMore = async () => {
        setLoading(true)
        const nextPage = page + 1
        const data = await APIService.GetUsers(nextPage)
        const sortedUsers = APIService.SortUsers(data.users)

        setUsers(prev => [...prev, ...sortedUsers])
        setPage(nextPage)

        if (nextPage >= data.total_pages) {
            setIsShowMore(false)
        }

        setLoading(false)
    }

    const refreshUsers = async () => {
        setLoading(true);
        let allUsers: IUser[] = [];

        for (let i = 1; i <= page; i++) {
            const data = await APIService.GetUsers(i);
            allUsers = [...allUsers, ...data.users];
        }

        const sortedUsers = APIService.SortUsers(allUsers);
        setUsers(sortedUsers);
        setLoading(false);
    };


    useEffect(() => {
        GetUsers()
    }, [])

    return (
        <>
            <header className='header'>
                <div className="header_container">
                    <img src="Logo.svg" alt="logo" />
                    <div className='header_buttons'>
                        <button className='header_button' onClick={() => { document.getElementById('users')?.scrollIntoView({ behavior: 'smooth' }) }}>Users</button>
                        <button className='header_button' onClick={() => { document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }) }}>Sign up</button>
                    </div>
                </div>
            </header>
            <main>
                <section className='about'>
                    <div className='about_container'>
                        <h2>Test assignment for front-end developer</h2>
                        <span>
                            What defines a good front-end developer is one that has skilled knowledge of HTML, CSS, JS with a vast understanding of User design thinking as they'll be building web interfaces with accessibility in mind. They should also be excited to learn, as the world of Front-End Development keeps evolving.
                        </span>
                        <button className='header_button' onClick={() => { document.getElementById('form')?.scrollIntoView({ behavior: 'smooth' }) }}>Sign up</button>
                    </div>
                </section>
                <section className='section_users' id='users'>
                    <h2>Working with GET request</h2>
                    <div className='users'>
                        {loading && <div>Loading...</div>}
                        {!loading && users.map(user => (
                            <User key={user.id} {...user} />
                        ))}
                    </div>
                    {isShowMore && (
                        <button
                            type="button"
                            className='header_button'
                            onClick={ShowMore}
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Show more'}
                        </button>
                    )}
                </section>
                <section className='section_form' id='form'>
                    <h2>Working with POST request</h2>
                    <Form refreshUsers={refreshUsers} />
                </section>
            </main>
        </>
    )
}

export default App

