import axios from "axios";
import { useState } from "react";
import { BsRobot } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";

const AITaskGenerator = () => {

    const [prompt, setPrompt] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const generateTask = async () => {
        try {

            if (!prompt) {
                alert("Please enter task idea");
                return;
            }

            setLoading(true);

            const response = await axios.post(
                "http://localhost:8000/api/ai/generate-task",
                {
                    prompt,
                }
            );

            setResult(response.data.result);

        } catch (error) {

            console.log(error);

            alert("AI generation failed");

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            {/* Header */}

            <div className="flex items-center gap-3 mb-6">

                <BsRobot className="text-4xl text-blue-600" />

                <div>
                    <h1 className="text-3xl font-bold">
                        AI Task Generator
                    </h1>

                    <p className="text-gray-600">
                        Generate professional employee tasks using AI
                    </p>
                </div>

            </div>

            {/* Input Card */}

            <div className="bg-white p-6 rounded-xl shadow-md">

                <label className="font-semibold text-lg">
                    Enter Task Idea
                </label>

                <textarea
                    rows="5"
                    placeholder="Example: Build employee attendance dashboard"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full border rounded-lg p-4 mt-3 outline-none focus:ring-2 focus:ring-blue-400"
                />

                <button
                    onClick={generateTask}
                    disabled={loading}
                    className="mt-4 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg font-semibold transition"
                >
                    {loading ? "Generating..." : "Generate Task"}
                </button>

            </div>

            {/* Result Section */}

            {result && (

                <div className="bg-white p-6 rounded-xl shadow-md mt-6">

                    <div className="flex items-center gap-2 mb-5">

                        <FaTasks className="text-2xl text-green-600" />

                        <h2 className="text-2xl font-bold">
                            Generated Task
                        </h2>

                    </div>

                    {/* Title */}

                    <div className="mb-4">

                        <h3 className="text-lg font-semibold text-gray-700">
                            Title
                        </h3>

                        <p className="text-xl font-bold">
                            {result.title}
                        </p>

                    </div>

                    {/* Description */}

                    <div className="mb-4">

                        <h3 className="text-lg font-semibold text-gray-700">
                            Description
                        </h3>

                        <p className="text-gray-700 leading-7">
                            {result.description}
                        </p>

                    </div>

                    {/* Priority */}

                    <div className="mb-4">

                        <h3 className="text-lg font-semibold text-gray-700">
                            Priority
                        </h3>

                        <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                            {result.priority}
                        </span>

                    </div>

                    {/* Estimated Time */}

                    <div className="mb-4">

                        <h3 className="text-lg font-semibold text-gray-700">
                            Estimated Time
                        </h3>

                        <p>
                            {result.estimated_time}
                        </p>

                    </div>

                    {/* Subtasks */}

                    <div>

                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Subtasks
                        </h3>

                        <ul className="space-y-2">

                            {result.subtasks?.map((task, index) => (

                                <li
                                    key={index}
                                    className="bg-gray-100 p-3 rounded-lg"
                                >
                                    ✅ {task}
                                </li>

                            ))}

                        </ul>

                    </div>

                </div>

            )}

        </div>
    );
};

export default AITaskGenerator;