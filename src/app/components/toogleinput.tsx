"use client"; // Hanya Client Component yang butuh ini

import React, { useState } from "react";
import { Button, InputNumber } from "antd";

const ToggleInput = () => {
  const [disabled, setDisabled] = useState(true);

  return (
    <div style={{ padding: "20px" }}>
      <InputNumber min={1} max={10} disabled={disabled} defaultValue={3} />
      <div style={{ marginTop: 20 }}>
        <Button onClick={() => setDisabled(!disabled)} type="primary">
          Toggle disabled
        </Button>
      </div>
    </div>
  );
};

export default ToggleInput;
