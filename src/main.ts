import { App, Plugin } from 'obsidian';
import type { MarkdownPostProcessorContext, PluginManifest } from 'obsidian';
import { DataviewApi, getAPI as getDataviewApi } from 'obsidian-dataview';
import { createRoot, Root } from 'react-dom/client';
import { createElement, ReactNode } from 'react';
import { Loading, Reader } from 'skybitsky-common';
import {
    Account,
    Period,
    Category,
    Transaction,
} from './ui';
import { Budget, BudgetInterface } from './services';

const SBS_BUDGET_ACCOUNT = CSS.escape('sbs:budget:account');
const SBS_BUDGET_PERIOD = CSS.escape('sbs:budget:period');
const SBS_BUDGET_CATEGORY = CSS.escape('sbs:budget:category');
const SBS_BUDGET_TRANSACTION = CSS.escape('sbs:budget:transaction');

declare module 'obsidian' {
    interface MetadataCache {
        on(
            name: 'dataview:index-ready',
            callback: () => void,
            ctx?: any,
        ): EventRef;
        on(
            name: 'dataview:metadata-change',
            callback: (type: string, page: any) => void,
            ctx?: any,
        ): EventRef;
    }
}

export default class BudgetPlugin extends Plugin {
    settings: BudgetPluginSettings = DEFAULT_SETTINGS;

    dataviewApi: DataviewApi;

    reader: Reader;

    budget: BudgetInterface;

    readonly rootsIndex: Map<string, Root> = new Map();

    readonly elementsFactoriesIndex: Map<Root, () => ReactNode> = new Map();

    constructor(app: App, manifest: PluginManifest) {
        super(app, manifest);

        const dataviewApi = getDataviewApi();

        if (!dataviewApi) {
            throw new Error('Dataview Plugin required');
        }

        this.dataviewApi = dataviewApi;
        this.reader = new Reader(this.dataviewApi);
        this.budget = new Budget(this.reader);
    }

    async onload() {
        await this.loadSettings();

        this.registerMarkdownCodeBlockProcessors();
        this.registerEvents();
    }

    onunload() {
        for (const [, root] of this.rootsIndex) {
            root.unmount();
        }
    }

    async loadSettings() {
        this.settings = {
            ...DEFAULT_SETTINGS,
            ...await this.loadData(),
        };
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    protected registerMarkdownCodeBlockProcessors(): void {
        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_ACCOUNT,
            (_, container, context) => this.handleAccountBlock(container, context),
        );

        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_PERIOD,
            (_, container, context) => this.handlePeriodBlock(container, context),
        );

        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_CATEGORY,
            (_, container, context) => this.handleCategoryBlock(container, context),
        );

        this.registerMarkdownCodeBlockProcessor(
            SBS_BUDGET_TRANSACTION,
            (_, container, context) => this.handleTransactionBlock(container, context),
        );
    }

    protected registerEvents(): void {
        this.registerEvent(
            this.app.metadataCache.on(
                'dataview:index-ready',
                this.onDataviewIndexReady,
                this,
            ),
        );

        this.registerEvent(
            this.app.metadataCache.on(
                'dataview:metadata-change',
                this.onDataviewMetadataChange,
                this,
            ),
        );
    }

    protected handleAccountBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
    ): void {
        const root = createRoot(container);

        this.rootsIndex.set(context.sourcePath, root);

        const elementFactory = () => createElement(Loading, {
            loading: !this.dataviewApi.index.initialized,
        }, createElement(Account, {
            budget: this.budget,
            path: context.sourcePath,
        }));

        this.elementsFactoriesIndex.set(root, elementFactory);

        root.render(elementFactory());
    }

    protected handlePeriodBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
    ): void {
        const root = createRoot(container);

        this.rootsIndex.set(context.sourcePath, root);

        const elementFactory = () => createElement(Loading, {
            loading: !this.dataviewApi.index.initialized,
        }, createElement(Period, {
            budget: this.budget,
            path: context.sourcePath,
        }));

        this.elementsFactoriesIndex.set(root, elementFactory);

        root.render(elementFactory());
    }

    protected handleCategoryBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
    ): void {
        const root = createRoot(container);

        this.rootsIndex.set(context.sourcePath, root);

        const elementFactory = () => createElement(Loading, {
            loading: !this.dataviewApi.index.initialized,
        }, createElement(Category, {
            budget: this.budget,
            path: context.sourcePath,
        }));

        this.elementsFactoriesIndex.set(root, elementFactory);

        root.render(elementFactory());
    }

    protected handleTransactionBlock(
        container: HTMLElement,
        context: MarkdownPostProcessorContext,
    ): void {
        const root = createRoot(container);

        this.rootsIndex.set(context.sourcePath, root);

        const elementFactory = () => createElement(Loading, {
            loading: !this.dataviewApi.index.initialized,
        }, createElement(Transaction, {
            budget: this.budget,
            path: context.sourcePath,
        }));

        this.elementsFactoriesIndex.set(root, elementFactory);

        root.render(elementFactory());
    }

    protected onDataviewIndexReady() {
        for (const [root, elementFactory] of this.elementsFactoriesIndex) {
            root.render(elementFactory());
        }
    }

    protected onDataviewMetadataChange(_type: string, page: any) {
        if (!page.path) {
            return;
        }

        const root = this.rootsIndex.get(page.path);

        if (!root) {
            return;
        }

        const elementFactory = this.elementsFactoriesIndex.get(root);

        if (!elementFactory) {
            return;
        }

        root.render(elementFactory());
    }
}

interface BudgetPluginSettings {
    rootPath: string;
}

const DEFAULT_SETTINGS: BudgetPluginSettings = {
    rootPath: 'Gaming',
};
