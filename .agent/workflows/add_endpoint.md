---
description: Add a new API endpoint wrapper
---

This workflow outlines the steps and references for adding a new API endpoint wrapper to the application.

### References

- **PWHL (HockeyTechDB)**:
  - **Local Reference**: [external-api-docs/hockeyTechApi.md](../external-api-docs/hockeyTechApi.md)
- **NHL**:
  - - **Local Reference**: [external-api-docs/nhlApi.md](../external-api-docs/nhlApi.md)

### Steps

1. **Identify the Endpoint**

   - Consult the appropriate reference linked above to find the endpoint URL and parameters.

2. **Implement the Wrapper**

   - Create a function/method to wrap the external API call.
   - Ensure it handles errors graceously.
   - Type the response data if possible (TypeScript).

3. **Verify the Endpoint**

   - **CRITICAL**: You MUST create a test or script to verify that the wrapper:
     - Successfully calls the API.
     - Returns data in the expected structure.
   - Run this verification immediately after implementation.

4. **Update Documentation**
   - Update any internal API documentation.
   - Ensure that the exact shape of the data is recorded for better reference down the line
