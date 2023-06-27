import React, { useState } from "react";

// Función para encontrar todas las posibles rutas utilizando el algoritmo de Dijkstra
function findAllPaths(graph, startNode, endNode) {
  // Se declara un objeto visited vacío para realizar un seguimiento de
  // los nodos visitados durante el proceso de exploración.
  const visited = {};
  // Se declara un arreglo paths vacío que almacenará todas las rutas encontradas
  // desde el nodo de inicio hasta el nodo final.
  const paths = [];
  // Función para la exploración de los nodos.
  function explore(node, path) {
    // Si el nodo actual es igual al nodo final,
    // se agrega la ruta completa (incluyendo el nodo final) al arreglo paths.
    if (node === endNode) {
      paths.push([...path, node]);
      return;
    }
    // Se marca el nodo actual como visitado estableciendo visited[node] en true.
    visited[node] = true;
    // Se obtienen los vecinos (nodos adyacentes) del nodo actual desde el grafo
    // utilizando graph[node].
    const neighbors = graph[node];
    // Si el vecino no ha sido visitado (!visited[neighbor]), se realiza una
    // exploración recursiva llamando a la función explore con el vecino como el
    // nuevo nodo actual y una nueva ruta que incluye el nodo actual.
    for (let neighbor in neighbors) {
      if (!visited[neighbor]) {
        explore(neighbor, [...path, node]);
      }
    }
    // Después de explorar todos los vecinos, se desmarca el nodo actual estableciendo
    // visited[node] en false. Esto permite que el nodo sea visitado nuevamente en
    // rutas diferentes.
    visited[node] = false;
  }
  // Se llama a la función explore inicialmente con el nodo de inicio (startNode) y
  // una ruta vacía ([]) para comenzar la exploración.
  explore(startNode, []);
  // Finalmente, se retorna el arreglo paths que contiene todas las posibles rutas
  // encontradas desde el nodo de inicio hasta el nodo final.
  return paths;
}

// Función para calcular la distancia total de una ruta en el grafo
function calculateDistance(graph, path) {
  let distance = 0;

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];
    distance += graph[current][next];
  }

  return distance;
}

// Función para encontrar la ruta más corta utilizando el algoritmo de Dijkstra
function findShortestPath(graph, startNode, endNode) {
  // Se llama a la función findAllPaths() para obtener todas las posibles rutas
  // desde el nodo de inicio hasta el nodo final.
  const paths = findAllPaths(graph, startNode, endNode);
  // Si no se encontraron rutas (paths.length === 0), significa que no hay ninguna
  // ruta posible desde el nodo de inicio hasta el nodo final.
  if (paths.length === 0) {
    return {
      shortestPath: [],
      distance: Infinity,
    };
  }
  // Inicialmente, se asigna la primera ruta encontrada (paths[0]) como la ruta más corta.
  let shortestPath = paths[0];
  // Después se calcula su distancia utilizando la función calculateDistance con los
  // argumentos graph y paths[0].
  let shortestDistance = calculateDistance(graph, paths[0]);

  for (let i = 1; i < paths.length; i++) {
    const distance = calculateDistance(graph, paths[i]);
    // Si la distancia de la ruta actual es menor que la distancia de la ruta más corta,
    // se actualiza la ruta más corta (shortestPath) y la distancia más corta
    // (shortestDistance) con los valores de la ruta actual.
    if (distance < shortestDistance) {
      shortestPath = paths[i];
      shortestDistance = distance;
    }
  }
  // Se retorna un objeto con la ruta más corta (shortestPath) y la distancia
  // más corta (distance: shortestDistance).
  return {
    shortestPath,
    distance: shortestDistance,
  };
}

// Componente de ejemplo que muestra todas las posibles rutas y la ruta más corta entre dos paradas de transporte público
function PublicTransportRoute() {
  const [startNode, setStartNode] = useState("");
  const [endNode, setEndNode] = useState("");
  const [routes, setRoutes] = useState([]);
  const [shortestPath, setShortestPath] = useState([]);
  const [distance, setDistance] = useState(0);

  // Grafo de ejemplo representando las conexiones entre las paradas de transporte público
  const graph = {
    A: { B: 2, C: 4, E: 2 },
    B: { A: 2, C: 5 },
    C: { A: 4, B: 5, D: 3, E: 3 },
    D: { C: 3, E: 1, F: 6 },
    E: { A: 2, C: 3, D: 1, F: 4 },
    F: { D: 6, E: 4 },
  };

  // Manejar el evento de envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar que se haya seleccionado un nodo de inicio y un nodo final
    if (startNode && endNode) {
      // Encontrar todas las posibles rutas utilizando el algoritmo de Dijkstra
      const allPaths = findAllPaths(graph, startNode, endNode);
      setRoutes(allPaths);

      // Encontrar la ruta más corta y su distancia
      const { shortestPath, distance } = findShortestPath(
        graph,
        startNode,
        endNode
      );
      setShortestPath(shortestPath);
      setDistance(distance);

      // Restablecer los valores de los campos de inicio y final
      setStartNode("");
      setEndNode("");
    }
  };

  return (
    <div>
      <h2>Buscar ruta de transporte público</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nodo de inicio:
          <input
            type="text"
            value={startNode}
            onChange={(e) => setStartNode(e.target.value)}
          />
        </label>
        <br />
        <label>
          Nodo final:
          <input
            type="text"
            value={endNode}
            onChange={(e) => setEndNode(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Buscar ruta</button>
      </form>
      <div className="contentPrincipal">
        {routes.length > 0 && (
          <div>
            <h3>Todas las posibles rutas:</h3>
            <div className="table">
              {routes.map((route, index) => (
                <div className="content" key={index}>
                  <p>{route.join(" -> ")}</p>
                  <p>Distancia: {calculateDistance(graph, route)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {shortestPath.length > 0 && (
          <div>
            <h3>Ruta más corta:</h3>
            <div className="content">
              <p>{shortestPath.join(" -> ")}</p>
              <p>Distancia: {distance}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PublicTransportRoute;
