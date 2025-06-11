import '../../styles/home.css'
import NewChallengeCard from '../../components/newChallengeCard';

export default function Home() {

    return (
        <div className='home-container'>
            <NewChallengeCard />
            <div className='card-container'>
                <div className=''>
                    WANT TO TRICK SOMEONE?
                </div>
                <div className='card-with-button'>
                    <div className=''>
                        THEN MAKE YOUR OWN
                    </div>
                    <a href="/perfil/create" className='card-button'>
                        CHALLENGE
                    </a>
                </div>
            </div>
            <div className='card-container'>
                <div className=''>
                    DON'T KNOW WHAT TO DO?
                </div>
                <div className='card-with-button'>
                    <div className=''>
                        JUST PLAY A
                    </div>
                    <a href="/random" className='card-button'>
                        RANDOM GAME
                    </a>
                </div>
            </div>
        </div>
    );
}