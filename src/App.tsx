import React, {useEffect, useState} from 'react';
import './style.scss'
import { v4 as uuidv4 } from 'uuid';

interface ITask {
    id: number | string
    text: string
    completed: boolean

}
const App: React.FC = () => {
    const [tasks,setTasks] = useState<ITask[] | null>([])
    const [active, setActive] = useState<string>('All')
    const [text, setText] = useState<string>('')
    const [editingTaskId, setEditingTaskId] = useState<number | string | null>(null);
    const [editingText, setEditingText] = useState<string>("");
    const leftItems = tasks?.filter(item => !item.completed) || []
    const completed = tasks?.filter((item: ITask) => {
        if  (item.completed) {
            return item
        }
    }) || [];

    useEffect(() => {
        const storedTasks = localStorage.getItem('tasks');

        if (storedTasks !== null) {
            const tasksArray = JSON.parse(storedTasks) as ITask[];
            setTasks(tasksArray)
        }
    },[])
    const handleOnChangeCheckbox = (id: number | string): void => {
        setTasks((prev) => {
            if (prev) {
                const updatedTasks = prev.map((item) => {
                    if (item.id === id) {
                        return { ...item, completed: !item.completed };
                    } else {
                        return item;
                    }
                });
                localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                return updatedTasks;
            } else {
                return null;
            }
        });
    };

    const handleOnEdit = (id: string | number) => {
        if  (id) {
            setEditingTaskId(id)
            const taskToEdit = tasks?.find(item => {
                if  (item.id === id) {
                    return item
                }
            })
            if  (taskToEdit) {
                setEditingText(taskToEdit.text)
            }
        }
    }
    const handleChangeStatus = (status: string) => {
        setActive(status)
    }
    const clearCompleted = () => {
        localStorage.setItem('tasks',JSON.stringify(leftItems))
        setTasks(prev => {
            if (prev) {
                return prev.filter(item => {
                    if  (!item.completed) {
                        return item
                    }
                })
            } else {
                return null;
            }
        })
    }
    const addTask = () => {
        const newTask: ITask = {
            id: uuidv4(),
            text,
            completed: false,
        };
        if (text.length >= 4) {
            setTasks((prev) => {
                if (prev) {
                    const updatedTasks = [...prev, newTask];
                    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
                    return updatedTasks;
                } else {
                    return [newTask];
                }
            });

            setText('');
        } else {
            alert('the minimum length is 4')
        }

    };

    const handleSaveEditedTask = (id: string | number) => {
        if (editingText.length >= 4) {
            setTasks((prev) => {
                if  (prev) {
                    const updatedTasks = prev.map((task) =>
                        task.id === id ? { ...task, text: editingText } : task
                    );
                    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
                    return updatedTasks;
                } else {
                    return null;
                }
            });
            setEditingTaskId(null);
        } else {
            alert("the minimum length is 4");
        }
    };


    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, id: string | number) => {
        if  (event.key === 'Enter') {
            if (event.currentTarget.className === 'todo__cont_top__field') {
                addTask()
            } else if (event.currentTarget.className === 'todo__content__tasksCont__task__editInput') {
                handleSaveEditedTask(id)
            }
        }
    }
    return (
        <div className={'todo'}>
          <h1 className={'todo__title'}>Todos</h1>
            <div className="todo__cont_top">
                <input placeholder={'Enter a task'} onKeyDown={(e) => handleKeyPress(e,'')} value={text} onChange={(e) => setText(e.target.value)} className={'todo__cont_top__field'} type="text"/>
                <button  onClick={addTask} type={'button'} className={'todo__cont_top__btn'}>Add a task</button>
            </div>
            <div className="todo__content">
                {
                    !tasks?.length ? <div className={'todo__content__errorCont'}><h2 className={'todo__content__errorCont__text'}>There are no tasks</h2></div> :
                        <div className={'todo__content__tasksCont'}>
                            {
                                active === 'Completed' ?  completed.length ? completed.map((item: ITask) => (
                                    <div key={item.id} className={'todo__content__tasksCont__task'}>
                                        <input onChange={() => handleOnChangeCheckbox(item.id)} className={'todo__content__tasksCont__task__checkbox'} checked={item.completed} type="checkbox"/>
                                        <h2 style={{textDecoration: item.completed ? "line-through" : ""}} className={'todo__content__tasksCont__task__text'}>{item.text}</h2>
                                    </div>
                                )) : <div className={'todo__content__errorCont'}><h2 className={'todo__content__errorCont__text'}>There are no completed tasks</h2></div> :
                                    tasks.map((item: ITask) => (
                                    <div key={item.id} className={'todo__content__tasksCont__task'}>
                                        {
                                            editingTaskId === item.id ? (
                                                <>
                                                    <input
                                                        onChange={() => handleOnChangeCheckbox(item.id)}
                                                        className={'todo__content__tasksCont__task__checkbox'}
                                                        checked={item.completed}
                                                        type="checkbox"
                                                    />
                                                    <input
                                                        value={editingText}
                                                        onKeyDown={(e) => handleKeyPress(e,item.id)}
                                                        onChange={(e) => setEditingText(e.target.value)}
                                                        className={'todo__content__tasksCont__task__editInput'}
                                                        type="text"
                                                    />
                                                    <button
                                                        onClick={() => handleSaveEditedTask(item.id)}
                                                        className={'todo__content__tasksCont__task__btn'}
                                                    >
                                                        Save
                                                    </button>
                                                </> ) : (
                                                <>
                                                    <input  onChange={() => handleOnChangeCheckbox(item.id)} className={'todo__content__tasksCont__task__checkbox'} checked={item.completed} type="checkbox"/>
                                                    <h2 style={{textDecoration: item.completed ? "line-through" : ""}} className={'todo__content__tasksCont__task__text'}>{item.text}</h2>
                                                    <button disabled={item.completed} onClick={() => handleOnEdit(item.id)} className="todo__content__tasksCont__task__btn">Edit</button>
                                                </>
                                            )
                                        }
                                    </div>
                                ))
                            }
                        </div>
                }
            </div>
            <div className="todo__footer">
                <p>{leftItems.length} {leftItems.length === 1 ? 'item' : 'items'} left</p>
                <div className={'todo__footer__conditions'}>
                    <button onClick={() => handleChangeStatus('All')} style={{background: active === 'All' ? '#DCDCDC' : ''}} className={'todo__footer__conditions__btn'}>All</button>
                    <button onClick={() => handleChangeStatus('Completed')} style={{background: active === 'Completed' ? '#DCDCDC' : ''}} className={'todo__footer__conditions__btn'}>Completed</button>
                </div>
                <button onClick={clearCompleted} className={'todo__footer__conditions__btn'}>Clear completed</button>
            </div>
        </div>
    );
};

export default App