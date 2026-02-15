---
description: Add a new API endpoint wrapper
---

This workflow outlines the steps and references for adding a new API endpoint wrapper to the application.

### References

- **PWHL (HockeyTechDB)**: [PWHL-Data-Reference](https://github.com/IsabelleLefebvre97/PWHL-Data-Reference/blob/main/README.md)
  - Use this for any PWHL / HockeyTechDB related endpoints.
- **NHL**: [NHL-API-Reference](https://github.com/Zmalski/NHL-API-Reference/blob/main/README.md)
  - Use this for any NHL related endpoints.

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
   - If applicable, update any internal API documentation.
