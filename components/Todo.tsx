"use client"

import { todo } from "node:test";
import { useState } from "react";

export default function Todo() {
    const [todoInput, setTodoInput] = useState("");
    const [todos, setTodos] = useState([] as string[]) ;
    
    // const handleSetTodo = (event: React.ChangeEvent<HTMLInputElement>) => {
    //     console.log(event.target.value);
    //     setTodoInput(event.target.value);
    // }
    const handleClick = () => {
        // ... js spread operator
        setTodos([...todos, todoInput]); // creates a new array based on the old array + todoInput
    }

    return (
        <div>
            <h1>Todo</h1>

            <p>
                Your todo is on the way, go do it {todoInput}
            </p>

            <input value={todoInput} onChange={(event) => setTodoInput(event.target.value)} 
                placeholder="Write what todo"/>

            <button onClick={handleClick}>Add Todo</button>


            <h2>My todos:</h2>
            <ul>
                {todos.map((todo, index) => (
                    <li key={index}>{todo}</li>
                ))}
            </ul>
        </div>
    );
}