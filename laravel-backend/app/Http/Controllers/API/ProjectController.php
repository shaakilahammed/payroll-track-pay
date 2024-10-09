<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Helpers\APIHelpers;
use App\Models\Project;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;


class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $projects = Project::where('deleted', false)
                        ->orderByDesc('id')
                        ->get();
            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Projects retrieved successfully', $projects));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving projects', $e->getMessage()), 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'due_date' => 'required|date',
            'budget' => 'required|numeric|min:0',
            'progress' => 'required|integer|min:0|max:100',
            'employee_ids' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        try {
            $project = Project::create([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'due_date' => $request->due_date,
                'budget' => $request->budget,
                'progress' => $request->progress,
                'employee_ids' => $request->employee_ids ?? [],
            ]);
            return response()->json(APIHelpers::createAPIResponse(false, 201, 'Project created successfully', $project), 201);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while creating the project', $e->getMessage()), 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        try {
            $project = Project::findOrFail($project->id);

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Project retrieved successfully', $project));
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while retrieving the project', $e->getMessage()), 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'start_date' => 'required|date',
            'due_date' => 'required|date',
            'budget' => 'required|numeric|min:0',
            'progress' => 'required|integer|min:0|max:100',
            'employee_ids' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            $errors = $validator->errors();
            return response()->json(APIHelpers::createAPIResponse(true, 422, 'Validation Error', $errors), 422);
        }

        try {
            $project->update([
                'name' => $request->name,
                'start_date' => $request->start_date,
                'due_date' => $request->due_date,
                'budget' => $request->budget,
                'progress' => $request->progress,
                'employee_ids' => $request->employee_ids ?? [],
            ]);

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Project updated successfully', $project), 200);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while updating the project', $e->getMessage()), 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        try {
            $project = Project::findOrFail($project->id);

            if (!$project) {
                return response()->json(APIHelpers::createAPIResponse(true, 404, 'Project not found', null), 404);
            }

            $project->update(['deleted' => true]);

            return response()->json(APIHelpers::createAPIResponse(false, 200, 'Project deleted successfully', null), 200);
        } catch (ModelNotFoundException $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 404, 'Project not found', null), 404);
        } catch (\Exception $e) {
            return response()->json(APIHelpers::createAPIResponse(true, 500, 'An error occurred while deleting the project', $e->getMessage()), 500);
        }
    }
}
