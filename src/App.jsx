import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import Die from "./components/Die";

import "./style.css";

export default () => {
    const { width, height } = useWindowSize();
    const [dice, setDice] = useState(allNewDice());
    const [tenzies, setTenzies] = useState(false);

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld);
        const firstValue = dice[0].value;
        const allSameValue = dice.every(die => die.value === firstValue);
        if (allHeld && allSameValue) {
            setTenzies(true);
            console.log("You won!");
        }
    }, [dice]);

    function holdDice(id) {
        setDice(prevDice =>
            prevDice.map(die => {
                return id === die.id ? { ...die, isHeld: !die.isHeld } : die;
            })
        );
    }

    function rollDice() {
        if (!tenzies) {
            setDice(prevDice =>
                prevDice.map(die => {
                    return die.isHeld ? die : generateNewDie();
                })
            );
        } else {
            setDice(allNewDice());
            setTenzies(false);
        }
    }

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        };
    }

    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie());
        }
        return newDice;
    }

    // Hook
    function useWindowSize() {
        // Initialize state with undefined width/height so server and client renders match
        // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
        const [windowSize, setWindowSize] = useState({
            width: undefined,
            height: undefined
        });
        useEffect(() => {
            // Handler to call on window resize
            function handleResize() {
                // Set window width/height to state
                setWindowSize({
                    width: window.innerWidth,
                    height: window.innerHeight
                });
            }
            // Add event listener
            window.addEventListener("resize", handleResize);
            // Call handler right away so state gets updated with initial window size
            handleResize();
            // Remove event listener on cleanup
            return () => window.removeEventListener("resize", handleResize);
        }, []); // Empty array ensures that effect is only run on mount
        return windowSize;
    }

    const diceElements = dice.map(die => {
        return (
            <Die
                key={die.id}
                value={die.value}
                isHeld={die.isHeld}
                holdDice={() => holdDice(die.id)}
            ></Die>
        );
    });

    return (
        <div className="game-container">
            <main className="game-view">
                {tenzies && <Confetti width={width} height={height} />}
                <h1 className="title">Tenzies</h1>
                <p className="instructions">
                    Roll until all dice are the same. Click each die to freeze
                    it at its current value between rolls.
                </p>
                <section className="game-view--dice">{diceElements}</section>
                <button className="game-view--roll" onClick={rollDice}>
                    {tenzies ? "New Game" : "Roll"}
                </button>
            </main>
        </div>
    );
};
