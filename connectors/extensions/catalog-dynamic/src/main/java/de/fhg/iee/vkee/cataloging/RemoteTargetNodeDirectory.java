package de.fhg.iee.vkee.cataloging;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.eclipse.edc.crawler.spi.TargetNode;
import org.eclipse.edc.crawler.spi.TargetNodeDirectory;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class RemoteTargetNodeDirectory implements TargetNodeDirectory {
    private static final TypeReference<List<TargetNode>> NODE_LIST_TYPE = new TypeReference<>() {
    };

    private final List<TargetNode> nodes = new ArrayList<>();

    private final URL url;

    private final ObjectMapper objectMapper;


    public RemoteTargetNodeDirectory(URL url, ObjectMapper mapper) {
        this.url = url;
        this.objectMapper = mapper;
        readAll(url);
    }

    private void readAll(URL url) {
        try {
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();
            var nodes = objectMapper.readValue(connection.getInputStream(), NODE_LIST_TYPE);
            this.nodes.addAll(nodes);

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

    }


    @Override
    public List<TargetNode> getAll() {
        return nodes;
    }

    @Override
    public void insert(TargetNode targetNode) {
        nodes.add(targetNode);
    }
}
