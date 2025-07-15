# Demonstator: Building a VPP using dataspace technlogies

This repository contains the soruce code to build and deploy a small scale dataspace. The demonstator showcases how the EDC connector technology can be used to simply the migration of DERs between VPPs.

## Prerequirements

- Docker Desktop
- Java 17+
- Maven


## Getting started

1. Clone this repository and navigate to to the project root.

2. Run the following command to build all artifacts and dependencies:

   ```bash
   docker compose build
   ```

3. Start the project using Docker Compose:

   ```bash
    docker compose up
    ```

4. Once the containers are up and running, you can access UI of the different participants at the following URLs:

    | Particpant        | Particpant-ID         | URL                   |
    |-------------------|-----------------------| ----------------------|
    | DER Operator      | VKEE-0000-0000-0001   | http://localhost:8010 |
    | Energy Trader #1  | VKEE-0000-0000-0002   | http://localhost:8020 |
    | Energy Trader #2  | VKEE-0000-0000-0003   | http://localhost:8030 |


5. Starting from here, you can replicate the migration flow as describe in the paper. 