import React, { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [pokemons, setPokemons] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [pokemonSeleccionado, setPokemonSeleccionado] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [filtroHabilidad, setFiltroHabilidad] = useState("");

  const traduccionesTipos = {
    normal: "Normal",
    fighting: "Lucha",
    flying: "Volador",
    poison: "Veneno",
    ground: "Tierra",
    rock: "Roca",
    bug: "Bicho",
    ghost: "Fantasma",
    steel: "Acero",
    fire: "Fuego",
    water: "Agua",
    grass: "Planta",
    electric: "Eléctrico",
    psychic: "Psíquico",
    ice: "Hielo",
    dragon: "Dragón",
    dark: "Siniestro",
    fairy: "Hada",
  };

  const traduccionesHabilidades = {
    overgrow: "Espesura",
    blaze: "Mar llamas",
    torrent: "Torrente",
    shield_dust: "Polvo escudo",
    run_away: "Fuga",
    chlorophyll: "Clorofila",
    static: "Electricidad estática",
    lightning_rod: "Pararrayos",
    levitate: "Levitación",
    intimidate: "Intimidación",
    keen_eye: "Vista lince",
    compound_eyes: "Ojos compuestos",
    swarm: "Enjambre",
    inner_focus: "Foco interno",
    synchronize: "Sincronía",
    flame_body: "Cuerpo llama",
    cute_charm: "Encanto",
    trace: "Rastro",
    hustle: "Entusiasmo",
    serene_grace: "Dicha",
    natural_cure: "Curación natural",
    // Puedes agregar más habilidades aquí
  };

  useEffect(() => {
    const fetchPokemons = async () => {
      const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=151"
      );
      const data = await response.json();
      const detalles = await Promise.all(
        data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          return await res.json();
        })
      );
      setPokemons(detalles);
    };

    const fetchTipos = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/type");
      const data = await res.json();
      setTipos(data.results.map((tipo) => tipo.name));
    };

    const fetchHabilidades = async () => {
      const res = await fetch("https://pokeapi.co/api/v2/ability?limit=327");
      const data = await res.json();
      setHabilidades(data.results.map((hab) => hab.name));
    };

    fetchPokemons();
    fetchTipos();
    fetchHabilidades();
  }, []);

  const filtrarPokemons = pokemons.filter((pokemon) => {
    const coincideNombre = pokemon.name
      .toLowerCase()
      .includes(busqueda.toLowerCase());
    const coincideTipo =
      filtroTipo === "todos" ||
      pokemon.types.some((t) => t.type.name === filtroTipo);
    const coincideHabilidad =
      !filtroHabilidad ||
      pokemon.abilities.some((a) => a.ability.name === filtroHabilidad);

    return coincideNombre && coincideTipo && coincideHabilidad;
  });

  return (
    <div className="container">
      <header>
        <img
          src="https://raw.githubusercontent.com/PokeAPI/media/master/logo/pokeapi_256.png"
          alt="Logo"
        />
        <input
          type="text"
          placeholder="Buscar nombre de Pokémon"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <select onChange={(e) => setFiltroTipo(e.target.value)}>
          <option value="todos">Todos los tipos</option>
          {tipos.map((tipo) => (
            <option key={tipo} value={tipo}>
              {traduccionesTipos[tipo] || tipo}
            </option>
          ))}
        </select>
      </header>

      <main>
        <aside>
          <h3>Tipo</h3>
          {tipos.map((tipo) => (
            <label key={tipo}>
              <input
                type="radio"
                name="tipo"
                value={tipo}
                checked={filtroTipo === tipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
              />
              {traduccionesTipos[tipo] || tipo}
            </label>
          ))}
          <label>
            <input
              type="radio"
              name="tipo"
              value="todos"
              checked={filtroTipo === "todos"}
              onChange={(e) => setFiltroTipo(e.target.value)}
            />
            Todos
          </label>

          <h3>Habilidades</h3>
          <div className="scrollable">
            {habilidades.map((hab) => (
              <label key={hab}>
                <input
                  type="radio"
                  name="habilidad"
                  value={hab}
                  checked={filtroHabilidad === hab}
                  onChange={(e) => setFiltroHabilidad(e.target.value)}
                />
                {traduccionesHabilidades[hab] || hab.replace(/-/g, " ")}
              </label>
            ))}
          </div>
        </aside>

        <section className="app">
          {pokemonSeleccionado ? (
            <PokemonDetalle
              pokemon={pokemonSeleccionado}
              onBack={() => setPokemonSeleccionado(null)}
              traduccionesTipos={traduccionesTipos}
            />
          ) : (
            <div className="grid">
              {filtrarPokemons.map((pokemon) => (
                <div
                  key={pokemon.id}
                  className="card"
                  onClick={() => setPokemonSeleccionado(pokemon)}
                >
                  <img src={pokemon.sprites.front_default} alt={pokemon.name} />
                  <h3>{pokemon.name}</h3>
                  <p>N.º {pokemon.id}</p>
                  <div className="tipos">
                    {pokemon.types.map((t) => (
                      <span key={t.type.name} className={`tipo ${t.type.name}`}>
                        {traduccionesTipos[t.type.name] || t.type.name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function PokemonDetalle({ pokemon, onBack, traduccionesTipos }) {
  return (
    <div className="detalle">
      <button onClick={onBack} className="volver">
        ← Volver
      </button>
      <h2>
        #{pokemon.id} {pokemon.name}
      </h2>
      <img
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={pokemon.name}
      />
      <div className="tipos">
        {pokemon.types.map((t) => (
          <span key={t.type.name} className={`tipo ${t.type.name}`}>
            {traduccionesTipos[t.type.name] || t.type.name}
          </span>
        ))}
      </div>

      <h3>Estadísticas</h3>
      <div className="stats">
        {pokemon.stats.map((s) => (
          <div key={s.stat.name} className="stat">
            <label>{s.stat.name}</label>
            <div className="barra">
              <div className="relleno" style={{ width: `${s.base_stat}px` }}>
                {s.base_stat}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
