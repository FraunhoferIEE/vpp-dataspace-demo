# Demonstator: Building a VPP using dataspace technlogies

This repository contains the source code to build and deploy a small scale dataspace. The demonstator showcases how the EDC connector technology can be used to simply the migration of DERs between VPPs.

## Prerequirements

- Docker Desktop or Rancher Desktop
- Docker Compose
- Java 17+
- Maven

### Rancher Desktop (Windows only)

If you using Rancher Desktop on Windows, you may need to update your Hostfile in `Windows\System32\drivers\etc\hosts` to include the following line:
    
    127.0.0.1 host.docker.internal

## Getting started

1. Configure your Git client to use LF line endings. This is important to ensure that the scripts and configuration files work correctly across different operating systems. You can do this by running the following command:

   ```bash
   git config core.autocrlf input
   ```

2. Clone this repository and navigate to to the project root.

3. Run the following command to build all artifacts and dependencies:

   ```bash
   docker compose build
   ```

4. Start the project using Docker Compose:

   ```bash
    docker compose up
    ```

5. Once the containers are up and running, you can access UI of the different participants at the following URLs:

    | Particpant        | Particpant-ID         | URL                   |
    |-------------------|-----------------------| ----------------------|
    | DER Operator      | VKEE-0000-0000-0001   | http://localhost:8010 |
    | Energy Trader #1  | VKEE-0000-0000-0002   | http://localhost:8020 |
    | Energy Trader #2  | VKEE-0000-0000-0003   | http://localhost:8030 |


6. Starting from here, you can replicate the migration flow as describe in the paper. 