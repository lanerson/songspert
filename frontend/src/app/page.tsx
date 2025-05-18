import { useEffect } from 'react';
import Game from '../../components/game/game';
import '../../styles/home.css'
import NewChallengeCard from '../../components/newChallengeCard';
export default function Home() {

    return (
        <div className='container'>
            {/* <Game /> */}
            <div className='homeContainer'>

                <div>
                    <div>
                        WANT TO TRICK SOMEONE?
                    </div>
                    <div>
                        THEN MAKE YOUR OWN
                    </div>
                    <div>
                        CHALLENGE
                    </div>
                </div>
                <div>
                    <div>
                        DON'T KNOW WHAT TO DO?
                    </div>
                    <div>
                        JUST PLAY A
                    </div>
                    <div>
                        RANDOM GAME
                    </div>
                </div>
            </div>
        </div>
    );
}