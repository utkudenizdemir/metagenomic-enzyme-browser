from flask import Blueprint, jsonify, make_response, json, request
import urllib.parse
from backend.model import Assembly, Biome, Geolocation, Sample, SequencingRun  # Correct the import to backend.model
from backend.model import Study
# Create a Blueprint for routes
main = Blueprint('main', __name__)

# Route for static data
@main.route("/api/data", methods=['GET'])
def data():
    return jsonify(
        {
            "data": {
                "data1": ["val1", "val12", "val13"],
                "data2": ["val2", "val22", "val23"],
                "data3": ["val3", "val32", "val33"]
            }
        }
    )

# Route for overall stats from the database
@main.route("/api/stats", methods=['GET'])
def stats():
    if 1 > 0:
        bp =20000000
        bp = [run.to_dict().get('total_base_pairs') for run in SequencingRun.query.all()]
        contigs = [run.to_dict().get('contig_count') for run in Assembly.query.all()]
        bp = sum(value or 0 for value in bp)
        contigs = sum(value or 0 for value in contigs)
        return jsonify({
            "Total Base Pairs": bp,
            "Total Contigs": contigs,
            "Total Samples": len(Sample.query.all()),
            "Total Studies": len(Study.query.all()),
            "Total Assemblies": len(Assembly.query.all())
        })
    else:
        return jsonify({"error": "No stats found"}), 404

# Route for all studies
@main.route("/api/studies", methods=['GET'])
def studies():
    studies = Study.query.all()

    entries = []
    for study in studies:
        entry=study.to_dict()
        entry['samples'] = [sample.to_dict() for sample in study.samples]
        entries.append(entry)

    response = make_response(json.dumps(entries, sort_keys=False, indent=4))
    response.mimetype = 'application/json' 

    return response
# Query route for studies
@main.route("/api/study", methods=['GET'])
def study():
    study_id = request.args.get('study_id')
    result = Study.query.get(study_id)
    samples = []
    for sample in result.samples:
        entry = sample.to_dict()
        entry['location'] = {
            "lat": sample.geolocation.latitude,
            "lng": sample.geolocation.longitude,
            "region" : sample.geolocation.region
        }
        samples.append(entry)
    results = result.to_dict()
    results['samples'] = samples
    if result:
        response = make_response(json.dumps(results,sort_keys=False, indent=4))
        response.mimetype = 'application/json'
        return response
    else: 
        return jsonify({"error": "No study found"}), 404
        

@main.route("/api/samplecoords", methods=['GET'])
def samplecoords():
    samples = Sample.query.all()
    entries = []
    for sample in samples:
        if sample.geolocation.latitude and sample.geolocation.longitude:
            entry = {}
            entry["sampleID"] = sample.prozomix_id
            entry["location"] = {"lat": sample.geolocation.latitude, "lng": sample.geolocation.longitude, "region" : sample.geolocation.region}
            entry["sampleNumID"] = sample.sample_num_id
            entry["studyID"] = sample.study.study_num_id
            entries.append(entry)
        else:
            continue
    response = make_response(json.dumps(entries, sort_keys=False, indent=4))
    response.mimetype = 'application/json' 

    return response

@main.route("/api/biomeinfo", methods=['GET'])
def biomeinfo():
    # biomes = Biome.query.all()[:6]
    entries = []
    biomes = list(set(x.biome_name  for x in Sample.query.all()))

    for biome in biomes:
        entry={}
        entry['biome_name'] =  biome
        entry['samples'] = len(Sample.query.filter(Sample.biome_name == biome).all())
        entries.append(entry)


    response = make_response(json.dumps(entries, sort_keys=True, indent=4))
    response.mimetype = 'application/json' 

    return response


@main.route("/api/geolocation", methods=['GET'])
def geolocation():
    sample_ids = request.args.get('sample_ids')
    print(sample_ids.split(","), type(sample_ids))
    sample_ids_list = sample_ids.split(",")

        # Fetch all matching samples along with their geolocations in one query
    samples = Sample.query.filter(Sample.sample_unique_id.in_(sample_ids_list)).all()

        # Collect geolocation data
    result = [
            sample.geolocation.to_dict() for sample in samples if sample.geolocation
        ]
    
    if result:
        response = make_response(json.dumps(result, sort_keys=False, indent=4))
        response.mimetype = 'application/json'
        return response
    else: 
        return jsonify({"error": "No study found"}), 404

@main.route("/api/sample", methods=['GET'])
def sample():
    sample_id = request.args.get('sample_id')
    result = Sample.query.get(sample_id)
    if not result: 
        return jsonify({"error": "No study found"}), 404
    if result:
        sample_data = {
            **result.to_dict(),
            "study": result.study.to_dict(),
            "biome": Biome.query.filter_by(biome_name=result.biome_name).first().to_dict(), 
            "geolocation": result.geolocation.to_dict(),
            "dna_preps": [{ **prep.to_dict(), "sequencing_runs": [run.to_dict() for run in prep.sequencing_runs] } for prep in result.dna_preps],
            "assemblies": [assembly.to_dict() for assembly in result.assemblies]
        }

        response = make_response(json.dumps(sample_data, sort_keys=False, indent=4))
        response.mimetype = 'application/json'
        return response
    
@main.route("/api/biome", methods=['GET'])
def biome():
    biome_name = urllib.parse.unquote(request.args.get('biome_name'))
    result = Biome.query.filter_by(biome_name=biome_name).first().to_dict()
    biome_info = {
        **result,
        'samples': [                   
             {
                **sample.to_dict(),
                'geolocation': sample.geolocation.to_dict()
             } for sample in Sample.query.filter(Sample.biome_name == biome_name).all()]

    }
    if result:
        response = make_response(json.dumps(biome_info, sort_keys=False, indent=4))
        response.mimetype = 'application/json'
        return response
    else:
        return jsonify({"error": "No biome found"}), 404
    
@main.route("/api/test", methods=['GET'])
def test():
    print(Sample.query.all())
    return jsonify({"test": "test"})