import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import { ArrowRight, Clock, Layers } from "lucide-react";
import { Button } from "~/components/ui/Button";
import Upload from "~/components/Upload";
import { useNavigate } from "react-router";
import { useState } from "react";
import { createProject } from "../../lib/puter.action";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<DesignItem[]>([]);

  const handleUploadComplete = async (base64Data: string) => {
    const newId = Date.now().toString();
    const name = `Residence ${newId}`;

    const newItem: DesignItem = {
      id: newId,
      name,
      sourceImage: base64Data,
      renderedImage: undefined,
      timestamp: Date.now(),
    };

    try {
      const saved = await createProject({ item: newItem });

      if (!saved) {
        console.error("Failed to create project");
        return false;
      }

      setProjects((prev) => [saved, ...prev]);

      navigate(`/visualizer/${newId}`, {
        state: {
          initialImage: saved.sourceImage,
          initialRendered: saved.renderedImage || null,
          name,
        },
      });
    } catch (error) {
      console.error("Error uploading project:", error);
      return false;
    }

    return true;
  };

  return (
    <div className="home">
      <Navbar />

      <section className="hero">
        <div className="announce">
          <div className="dot">
            <div className="pulse"></div>
          </div>

          <p>Introducing FormScape</p>
        </div>

        <h1>Build beautiful spaces at the speed of thought with FormScape</h1>

        <p className="subtitle">
          FormScape is an AI-first design environment that helpts you visualize,
          render, and ship architectural projects faster than ever.
        </p>

        <div className="actions">
          <a href="#upload" className="cta">
            Start Building <ArrowRight className="icon" />
          </a>

          <Button variant="outline" size="lg" className="demo">
            Watch Demo
          </Button>
        </div>

        <div className="upload-shell" id="upload">
          <div className="grid-overlay" />

          <div className="upload-card">
            <div className="upload-head">
              <div className="upload-icon">
                <Layers className="icon" />
              </div>

              <h3>Upload your floor plan</h3>
              <p>Supports JPG, PNG, formats up to 10MB</p>
            </div>

            <Upload onComplete={handleUploadComplete} />
          </div>
        </div>
      </section>

      <section className="projects">
        <div className="section-inner">
          <div className="section-head">
            <div className="copy">
              <h2>Projects</h2>
              <p>
                Your latest work and shared commpunity projects, all in one
                place.
              </p>
            </div>
          </div>

          <div className="projects-grid">
            {projects.map(
              ({ id, name, renderedImage, sourceImage, timestamp }) => (
                <div className="project-card group">
                  <div className="preview">
                    <img src={renderedImage || sourceImage} alt="Project" />

                    <div className="badge">Community</div>
                  </div>

                  <div className="card-body">
                    <div>
                      <h3>{name}</h3>
                      <div className="meta">
                        <Clock size={12} />
                        <span>{new Date(timestamp).toLocaleDateString()}</span>
                        <span>By Yasela Dissanayake</span>
                      </div>
                    </div>

                    <div className="arrow">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
