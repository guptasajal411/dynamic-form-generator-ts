import React, { useState } from "react";
import Layout from "./components/Layout";
import FormGenerator from "./components/FormGenerator";
import JSONEditor from "./components/JSONEditor";
import { jsonError } from "./types/errors";
import { sampleSchema } from "./utils/sampleSchema";


const App: React.FC = () => {
    const [schema, setSchema] = useState(sampleSchema);
    const [jsonError, setJsonError] = useState<jsonError>({ isError: false });

    return (
        <Layout>
            <JSONEditor schema={schema} setSchema={setSchema} setJsonError={setJsonError} />
            <FormGenerator schema={schema} jsonError={jsonError} />
        </Layout>
    );
};

export default App;
