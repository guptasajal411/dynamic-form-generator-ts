import React, { useState } from "react";
import Layout from "./components/Layout";
import FormGenerator from "./components/FormGenerator";
import JSONEditor from "./components/JSONEditor";

import { sampleSchema } from "./utils/sampleSchema";

const App: React.FC = () => {
    const [schema, setSchema] = useState(sampleSchema);

    return (
        <Layout>
            <JSONEditor schema={schema} setSchema={setSchema} />
            <FormGenerator schema={schema} />
        </Layout>
    );
};

export default App;
